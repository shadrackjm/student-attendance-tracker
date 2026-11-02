<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_class_id')->constrained()->cascadeOnDelete();
            $table->foreignId('taken_by')->nullable()->constrained('teachers')->nullOnDelete();
            $table->date('date');
            $table->string('note')->nullable();
            $table->timestamps();

            $table->unique(['school_class_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_sessions');
    }
};
