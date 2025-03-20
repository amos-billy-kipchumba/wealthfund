<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            margin-top: 20px;
        }
    </style>
</head>
<body>

    <h2>Congratulations, {{ $asset->employee->user->name }}!</h2>
    <p>We are excited to inform you that your asset application has been approved.</p>
    
    <p>Details of your asset:</p>
    <ul>
        <li><strong>Asset Number:</strong> {{ $asset->number }}</li>
        <li><strong>Principle:</strong> {{ round(($asset->amount - $asset->charges),2) }}</li>
        <li><strong>Charges:</strong> {{ round(($asset->charges),2) }}</li>
        <li><strong>Amount due:</strong> {{ $asset->amount }}</li>
    </ul>

    <p>Your asset is now in process. You will receive further instructions shortly.</p>
    <p>If you have any questions or concerns, please don't hesitate to reach out to us.</p>
    
    <p>Thank you for choosing Nyotafund!</p>

    <p>Best regards,</p>
    <p><strong>The Nyotafund Team</strong></p>
</body>
</html>
