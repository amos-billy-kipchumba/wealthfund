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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('registration_number')->nullable();
            $table->string('industry')->nullable();
            $table->string('sectors')->nullable();
            $table->string('county')->nullable();
            $table->string('sub_county')->nullable();
            $table->string('location')->nullable();
            $table->string('address')->nullable();
            $table->string('email')->unique()->nullable();
            $table->string('phone')->nullable();
            $table->double('percentage')->nullable();
            $table->double('loan_limit')->nullable();
            $table->string('unique_number')->nullable();
            $table->string('certificate_of_incorporation')->nullable();
            $table->string('kra_pin')->nullable();
            $table->string('cr12_cr13')->nullable();
            $table->string('signed_agreement')->nullable();
            $table->json('additional_documents')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
