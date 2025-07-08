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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('event_name')->nullable();
            $table->date('load_start')->nullable();
            $table->date('load_end')->nullable();
            $table->date('show_start')->nullable();
            $table->date('show_end')->nullable();
            $table->date('unload_start')->nullable();
            $table->date('unload_end')->nullable();
            $table->tinyInteger('status')->unsigned()->default(0)->comment('0=New Inquiry,1=Sudah Confirm GBK dan JICC,2=Sudah Dilaksanakan');
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
