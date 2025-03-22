<?php

namespace App\Mail;

use App\Models\Investor;  // Use the correct namespace
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvestorApprovalMail extends Mailable
{
    use Queueable, SerializesModels;

    public $investor;

    /**
     * Create a new message instance.
     *
     * @param  \App\Models\Investor  $investor
     * @return void
     */
    public function __construct(Investor $investor)
    {
        $this->investor = $investor;
    }

    /**
     * Build the message.
     *
     * @return \Illuminate\Mail\Mailable
     */
    public function build()
    {
        return $this->subject('Your Nyotafund Application Has Been Approved')
                    ->view('emails.investor_approval')
                    ->with([
                        'investor' => $this->investor
                    ]);
    }
}



