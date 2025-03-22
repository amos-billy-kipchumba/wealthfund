<?php

namespace App\Mail;

use App\Models\Investor;  
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvestorDeclinedMail extends Mailable
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

        return $this->subject('Your Details Have Been Declined')
                    ->view('emails.investor_declined')
                    ->with([
                        'investor' => $this->investor
                    ]);
    }
}



