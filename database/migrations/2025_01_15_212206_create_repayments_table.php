<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('repayments', function (Blueprint $table) {
            $table->id();
            $table->string('number')->nullable();
            $table->string('status')->nullable();
            $table->double('amount')->nullable();
            $table->dateTime('payment_date')->nullable();
            $table->unsignedBigInteger('asset_id')->nullable();
            $table->unsignedBigInteger('investor_id')->nullable();
            $table->foreign('investor_id')->references('id')->on('investors')->onDelete('cascade'); // Then add foreign key constraint
            $table->unsignedBigInteger('remittance_id')->nullable();
            $table->foreign('remittance_id')->references('id')->on('remittances')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('repayments');
    }
};
