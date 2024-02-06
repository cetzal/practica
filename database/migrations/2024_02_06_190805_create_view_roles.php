<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Migrations\Migration;

class CreateViewRoles extends Migration
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
            CREATE VIEW view_roles AS
                SELECT *
                FROM roles;
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
            DROP VIEW IF EXISTS view_roles;
            SQL;
    }
}
