<?php

namespace App\Mail;

use App\Models\Asset;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;  // Import Envelope
use Illuminate\Mail\Mailables\Content;  // Import Content
use Illuminate\Queue\SerializesModels;

class AssetApprovalMail extends Mailable
{
    use Queueable, SerializesModels;

    public $asset;

    /**
     * Create a new message instance.
     */
    public function __construct(Asset $asset)
    {
        $this->asset = $asset;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Asset Has Been Approved'
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.asset_approval',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
