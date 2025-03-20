<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Asset Repayment Received</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .content {
            font-size: 16px;
            line-height: 1.6;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 14px;
            color: #888;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="content">
        <h2>Dear {{ $repayment->asset->employee->user->name ?? '' }},</h2>

        <p>We have received your asset repayment of <strong>{{ $repayment->amount }}</strong> for your advance from {{ $repayment->asset->product->name ?? '' }}.</p>

        <p>Details of your asset repayment:</p>
        <ul>
            <li><strong>Repayment Number:</strong> {{ $repayment->number }}</li>
            <li><strong>Employee Product:</strong> {{ $repayment->asset->employee->product->name ?? '' }}</li>
            <li><strong>Principle:</strong> {{ round(($repayment->asset->amount - $repayment->asset->charges),2) }}</li>
            <li><strong>Charges:</strong> {{ round(($repayment->asset->charges),2) }}</li>
            <li><strong>Amount due:</strong> {{$repayment->asset->amount }}</li>
            <li><strong>Current balance:</strong> {{ $repayment->asset->currentBalance ?? '' }}</li>
        </ul>

        <p>Your repayment is being processed and will be reflected in your asset balance shortly. Thank you for your timely payment!</p>

        <p>If you have any questions about this repayment, feel free to contact us.</p>
    </div>

    <div class="footer">
        <p>Best regards,</p>
        <p><strong>The Nyotafund Team</strong></p>
        <p><a href="mailto:support@Nyotafund.co.ke">Contact Support</a></p>
    </div>
</div>

</body>
</html>
