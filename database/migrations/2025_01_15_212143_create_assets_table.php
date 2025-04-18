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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->double('amount')->nullable();
            $table->string('status')->nullable();
            $table->string('number')->nullable();
            $table->string('otp')->nullable();
            $table->dateTime('disbursed_at')->nullable();
            $table->unsignedBigInteger('investor_id');
            $table->unsignedBigInteger('product_id');
            $table->foreign('investor_id')->references('id')->on('investors')->onDelete('cascade');
            $table->unsignedBigInteger('asset_provider_id');
            $table->foreign('asset_provider_id')->references('id')->on('asset_providers')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
