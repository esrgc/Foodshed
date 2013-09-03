using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ESRGC.GIS.Domain.Entities
{
    public class JSonCandidates
    {
        public JSonCandidates()
        {
            candidates = new List<Candidate>();
        }
        public List<Candidate> candidates { get; set; }
    }

    public class Candidate
    {
        public string address { get; set; }
        public Location location { get; set; }
        public string attributes { get; set; }
        public int score { get; set; }
    }

    public class AddressCandidates
    {
        public Address address { get; set; }
        public Location location { get; set; }
    }

    public class Address
    {
        public string Street { get; set; }
        public string Zone { get; set; }
    }

    public class Location
    {
        public double x { get; set; }
        public double y { get; set; }
        public SpatialReference spatialReference { get; set; }
    }
    public class SpatialReference
    {
        public int wkid { get; set; }
    }
}
