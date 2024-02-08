<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCreatedByToBrands extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasColumn('brands', 'created_by')) {
            Schema::table('brands', function (Blueprint $table) {
                $table->unsignedInteger('created_by')->after('is_active')->nullable();
                $table->foreign('created_by')->references('id')->on('users');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::hasColumn('brands', 'created_by')) {
            Schema::table('brands', function (Blueprint $table) {
                $table->dropForeign('brands_created_by_foreign');
                $table->dropIndex('brands_created_by_foreign');
                $table->dropColumn('created_by');
            });
        }
    }
}
