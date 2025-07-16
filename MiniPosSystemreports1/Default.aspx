<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>
<%@ Register Assembly="Microsoft.ReportViewer.WebForms"
    Namespace="Microsoft.Reporting.WebForms" TagPrefix="rsweb" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Monthly Sales Report</title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <asp:Label ID="lblDate" runat="server" Text="Enter Date (yyyy-MM-dd): " />
            <asp:TextBox ID="txtDate" runat="server" Text="2025-04-01" />
            <asp:Button ID="btnLoadReport" runat="server" Text="Load Report" OnClick="btnLoadReport_Click" />
            <br /><br />

            
            <asp:ScriptManager ID="ScriptManager1" runat="server" />

           
            <rsweb:ReportViewer 
                ID="ReportViewer1" 
                runat="server" 
                Width="100%" 
                Height="800px" 
                ProcessingMode="Remote" />
        </div>
    </form>
</body>
</html>
