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
    </style>
</head>
<body>
    <h2>Welcome to Nyotafund, {{ $user->name }}!</h2>
    <p>Thank you for registering with us. We're excited to have you on board.</p>
    <p>This is your login password {{$password}}</p>
    <p>If you have any questions or need assistance, feel free to contact us at any time.</p>
    <p>Best regards,</p>
    <p><strong>The Nyotafund Team</strong></p>
</body>
</html>
