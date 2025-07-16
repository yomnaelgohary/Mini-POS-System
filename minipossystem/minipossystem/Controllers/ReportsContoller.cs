using Microsoft.AspNetCore.Mvc;
using minipossystem.Models;
using System;
using System.Data;
using Microsoft.Data.SqlClient;




namespace minipossystem.Controllers
{
    public class ReportsController : Controller

    {
        private readonly string connectionString = "Server=DESKTOP-S1HVK3I;Database=mini-pos-system;Trusted_Connection=True;TrustServerCertificate=True;";


        private readonly MiniPosSystemContext context = new MiniPosSystemContext();

        public IActionResult MonthlySales2()
        {
            return View(); // Looks for Views/Reports/MonthlySales2.cshtml
        }

        //public IActionResult Index(string date = null)
        //{
        //    if (string.IsNullOrWhiteSpace(date))
        //        date = DateTime.Today.ToString("yyyy-MM-dd");

        //    string webFormsUrl = $"http://localhost:53906/Default.aspx?date={date}";

        //    ViewBag.WebFormsUrl = webFormsUrl;
        //    ViewBag.Date = date;

        //    return View();
        //}
        //public IActionResult MonthlySales(string fromDate = null, string toDate = null)
        //{
        //    if (string.IsNullOrWhiteSpace(fromDate))
        //        fromDate = DateTime.Today.AddDays(-30).ToString("yyyy-MM-dd");
        //    if (string.IsNullOrWhiteSpace(toDate))
        //        toDate = DateTime.Today.ToString("yyyy-MM-dd");

        //    string webFormsUrl = $"http://localhost:53906/Default2.aspx?FromDate={fromDate}&ToDate={toDate}";

        //    ViewBag.WebFormsUrl = webFormsUrl;
        //    ViewBag.FromDate = fromDate;
        //    ViewBag.ToDate = toDate;

        //    return View();
        //}
        public List<MonthlySalesDTO> GetMonthlySales(DateTime fromDate, DateTime toDate)
        {
            var results = new List<MonthlySalesDTO>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("GetTotalSalesPerMonth", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@FromDate", fromDate);
                    cmd.Parameters.AddWithValue("@ToDate", toDate);

                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            results.Add(new MonthlySalesDTO
                            {
                                SalesMonth = reader["salesmonth"].ToString(),
                                TotalSales = Convert.ToDecimal(reader["Totalsales"])
                            });
                        }
                    }
                }
            }

            return results;
        }
        [HttpGet]
        public JsonResult GetMonthlySalesJson(string fromDate, string toDate)
        {
            DateTime from = DateTime.Parse(fromDate);
            DateTime to = DateTime.Parse(toDate);
            var data = GetMonthlySales(from, to);
            return Json(data);
        }

        [HttpGet]
        public JsonResult GetMonthDetailsJson(string date)
        {
            var results = new List<MonthDetailDTO>();
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("GetMonthDetails", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Date", DateTime.Parse(date));
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            results.Add(new MonthDetailDTO
                            {
                                SalesOrderItemID = Convert.ToInt32(reader["SalesOrderItemID"]),
                                Price = Convert.ToDecimal(reader["price"])
                            });
                        }
                    }
                }
            }
            return Json(results);
        }



    }




}
