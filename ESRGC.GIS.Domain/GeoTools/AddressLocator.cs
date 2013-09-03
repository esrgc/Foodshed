using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;
using ESRGC.GIS.Domain.Entities;
using System.Runtime.Serialization.Json;
using ESRGC.GIS.Domain.Entities.Geometry;
using ESRGC.GIS.Domain.Abstract;
using ESRGC.GIS.Domain.Helpers;

namespace ESRGC.GIS.Domain.GeoTools
{
    public class AddressLocator : AddressPoint, IAddressLocator
    {
        const int ACCEPT_SCORE = 65;//score accepted when using iMAP

        /// <summary>
        /// Geocode address with iMap geocoding engine
        /// </summary>
        /// <param name="address">Address to geocode</param>
        /// <param name="zipCode">zip code</param>
        public bool geocode(string address, string zipCode)
        {
            Address = address;
            ZipCode = zipCode;

            try
            {
                HelperClass.parseAddressFromInput(Address);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            
            string url = @"http://mdimap.towson.edu/ArcGIS/rest/services/GeocodeServices/MD.State.MDStatewideLocator/GeocodeServer/findAddressCandidates?Street="
                        + Address + "&Zone=" + ZipCode + "&outFields=&f=pjson";
            //geocode
            getXYFromAddress(url);
            //confirm result
            return isValid;
        }
        /// <summary>
        /// Reverse geocode X, Y
        /// </summary>
        /// <param name="x">X coordinate</param>
        /// <param name="y">Y coordinate</param>
        public bool reverseGeocode(double x, double y, double radius)
        {
            X = x;
            Y = y;

            string url = string.Format(@"http://mdimap.towson.edu/ArcGIS/rest/services/GeocodeServices/MD.State.MDStatewideLocator/GeocodeServer/reverseGeocode?location={0}%2C+{1}&distance={2}&f=pjson",
                                X, Y, radius);

            //reverse geocode
            getAddressFromXY(url);
            //confirm result
            return isValid;
        }


        /*
         *Function to get XY from URL provided
         */
        void getXYFromAddress(string url)
        {
            //Application manifold = new Application();

            try
            {
                url = url.Replace(" ", "+");
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(new Uri(url));
                webRequest.Method = "GET";
                webRequest.ContentType = "text";

                HttpWebResponse webResponse = (HttpWebResponse)webRequest.GetResponse();
                System.IO.Stream stream = webResponse.GetResponseStream();
                StreamReader responseStreamReader = new StreamReader(stream);

                JSonCandidates candidates = new JSonCandidates();

                //read json string
                DataContractJsonSerializer serializer =
                    new DataContractJsonSerializer(candidates.GetType());

                //CandidateCollections candidates = (CandidateCollections)serializer.ReadObject(stream);
                //or
                string result = responseStreamReader.ReadToEnd();
                MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(result));
                candidates = (JSonCandidates)serializer.ReadObject(ms);

                webResponse.Close();

                int maxScore = 0;

                //parse the xy with 80 score or more
                foreach (Candidate c in candidates.candidates)
                {
                    if (c.score >= ACCEPT_SCORE && c.score > maxScore)
                    {
                        X = c.location.x;//set X
                        Y = c.location.y;//set Y

                        maxScore = c.score;
                        GeoCodingScore = maxScore;

                    }
                }
                isValid = true;
            }
            catch (ArgumentOutOfRangeException)
            {
                isValid = false;
            }
            catch
            {
                isValid = false;
            }
        }

        void getAddressFromXY(string url)
        {
            //Application manifold = new Application();
            try
            {
                url = url.Replace(" ", "+");
                HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(new Uri(url));
                webRequest.Method = "GET";
                webRequest.ContentType = "text";

                HttpWebResponse webResponse = (HttpWebResponse)webRequest.GetResponse();
                System.IO.Stream stream = webResponse.GetResponseStream();
                StreamReader responseStreamReader = new StreamReader(stream);

                AddressCandidates addressCandidate = new AddressCandidates();

                //read json string
                DataContractJsonSerializer serializer =
                    new DataContractJsonSerializer(addressCandidate.GetType());

                //CandidateCollections candidates = (CandidateCollections)serializer.ReadObject(stream);
                //or
                string result = responseStreamReader.ReadToEnd();
                MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(result));
                addressCandidate = (AddressCandidates)serializer.ReadObject(ms);
                serializer.WriteObject(ms, addressCandidate);
                webResponse.Close();

                //parse address
                this.Address = addressCandidate.address.Street;
                this.ZipCode = addressCandidate.address.Zone;

            }
            catch (ArgumentOutOfRangeException)
            {
                isValid = false;
            }
            catch
            {
                isValid = false;
            }
        }

        

        #region IAddressLocator Members

        public AddressPoint GeoData
        {
            get { return this; }
        }

        #endregion
    }
}
