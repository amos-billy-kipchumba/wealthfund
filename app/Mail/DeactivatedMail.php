<?php

namespace App\Mail;

use App\Models\Employee;  
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DeactivatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $employee;

    /**
     * Create a new message instance.
     *
     * @param  \App\Models\Employee  $employee
     * @return void
     */
    public function __construct(Employee $employee)
    {
        $this->employee = $employee;
    }

    /**
     * Build the message.
     *
     * @return \Illuminate\Mail\Mailable
     */
    public function build()
    { 

        return $this->subject('Your Account has been deactivated')
                    ->view('emails.employee_deactivation')
                    ->with([
                        'employee' => $this->employee
                    ]);
    }
}



