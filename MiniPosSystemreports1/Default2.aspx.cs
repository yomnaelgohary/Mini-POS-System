using System;
using Microsoft.Reporting.WebForms;

public partial class _Default2 : System.Web.UI.Page
{
    protected void btnLoadReport_Click(object sender, EventArgs e)
    {
        string fromDate = txtFromDate.Text.Trim();
        string toDate = txtToDate.Text.Trim();
        LoadReport(fromDate, toDate);
    }

    private void LoadReport(string fromDate, string toDate)
    {
        ReportViewer1.ProcessingMode = ProcessingMode.Remote;
        ReportViewer1.ServerReport.ReportServerUrl = new Uri("http://localhost/ReportServer");
        ReportViewer1.ServerReport.ReportPath = "/reports/MonthlySalesReport"; // Replace with actual path

        ReportParameter[] parameters = new ReportParameter[]
        {
            new ReportParameter("FromDate", fromDate),
            new ReportParameter("ToDate", toDate)
        };

        ReportViewer1.ServerReport.SetParameters(parameters);
        ReportViewer1.ServerReport.Refresh();
    }
}
