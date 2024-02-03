<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateViewBranch extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::statement($this->dropView());

        DB::statement($this->createView());
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::statement($this->dropView());
    }

    /**
     * Create view branch
     * 
     * @return void
     */
    private function createView()
    {
        return <<<SQL
            CREATE VIEW view_brands AS
                SELECT id, name, description, is_active 
                FROM brands;
            SQL;
    }

    /**
     * Drop view if exists
     * 
     * @return void
     */
    private function dropView()
    {
        return <<<SQL
            DROP VIEW IF EXISTS view_brands;
            SQL;
    }
}
