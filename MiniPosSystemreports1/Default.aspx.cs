using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

using Microsoft.Reporting.WebForms;

public partial class _Default : System.Web.UI.Page
{
    protected void btnLoadReport_Click(object sender, EventArgs e)
    {
        string date = txtDate.Text.Trim();
        LoadReport(date);
    }

    private void LoadReport(string dateParam)
    {
        ReportViewer1.ProcessingMode = ProcessingMode.Remote;
        ReportViewer1.ServerReport.ReportServerUrl = new Uri("http://localhost/ReportServer");
        ReportViewer1.ServerReport.ReportPath = "/reports/MonthDetails";
        ReportParameter param = new ReportParameter("Date", dateParam);
        ReportViewer1.ServerReport.SetParameters(new[] { param });

        ReportViewer1.ServerReport.Refresh();
    }
}
