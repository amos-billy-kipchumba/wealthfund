<?php

namespace App\Mail;

use App\Models\Asset;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AssetDeclinedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $asset;
    public $reason;

    /**
     * Create a new message instance.
     */
    public function __construct(Asset $asset, $reason)
    {
        $this->asset = $asset;
        $this->reason = $reason;
    }

    /**
     * Get the message content definition.
     */
    public function build()
    {
        return $this->subject('Asset Application Status: Declined')
                    ->view('emails.asset_declined')
                    ->with([
                        'asset' => $this->asset,
                        'reason' => $this->reason,
                    ]);
    }
}
