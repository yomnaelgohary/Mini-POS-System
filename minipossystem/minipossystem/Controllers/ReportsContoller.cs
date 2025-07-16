using Microsoft.AspNetCore.Mvc;
using System;

namespace minipossystem.Controllers
{
    public class ReportsController : Controller
    {
        public IActionResult Index(string date = null)
        {
            if (string.IsNullOrWhiteSpace(date))
                date = DateTime.Today.ToString("yyyy-MM-dd");

            string webFormsUrl = $"http://localhost:53906/Default.aspx?date={date}";

            ViewBag.WebFormsUrl = webFormsUrl;
            ViewBag.Date = date;

            return View();
        }
        public IActionResult MonthlySales(string fromDate = null, string toDate = null)
        {
            if (string.IsNullOrWhiteSpace(fromDate))
                fromDate = DateTime.Today.AddDays(-30).ToString("yyyy-MM-dd");
            if (string.IsNullOrWhiteSpace(toDate))
                toDate = DateTime.Today.ToString("yyyy-MM-dd");

            string webFormsUrl = $"http://localhost:53906/Default2.aspx?FromDate={fromDate}&ToDate={toDate}";

            ViewBag.WebFormsUrl = webFormsUrl;
            ViewBag.FromDate = fromDate;
            ViewBag.ToDate = toDate;

            return View();
        }
    }



}
