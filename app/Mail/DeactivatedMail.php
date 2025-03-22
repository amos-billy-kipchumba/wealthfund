<?php

namespace App\Mail;

use App\Models\Investor;  
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DeactivatedMail extends Mailable
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

        return $this->subject('Your Account has been deactivated')
                    ->view('emails.investor_deactivation')
                    ->with([
                        'investor' => $this->investor
                    ]);
    }
}



