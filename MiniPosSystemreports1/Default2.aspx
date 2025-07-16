<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default2.aspx.cs" Inherits="_Default2" %>
<%@ Register Assembly="Microsoft.ReportViewer.WebForms"
    Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<!DOCTYPE html>
<html>
<head runat="server">
    <title>Monthly Sales Report</title>
</head>
<body>
    <form id="form1" runat="server">

        <!-- Required for ReportViewer -->
        <asp:ScriptManager ID="ScriptManager1" runat="server" />

        <asp:Label runat="server" Text="From Date (yyyy-MM-dd): " />
        <asp:TextBox ID="txtFromDate" runat="server" Text="2025-07-01" />

        <asp:Label runat="server" Text="To Date (yyyy-MM-dd): " />
        <asp:TextBox ID="txtToDate" runat="server" Text="2025-07-16" />

        <asp:Button ID="btnLoadReport" runat="server" Text="Load Report" OnClick="btnLoadReport_Click" />
        <br /><br />

        <rsweb:ReportViewer 
            ID="ReportViewer1" 
            runat="server" 
            Width="100%" 
            Height="800px" 
            ProcessingMode="Remote" />
    </form>
</body>
</html>
