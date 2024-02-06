<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Migrations\Migration;

class CreateViewUsers extends Migration
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
            CREATE VIEW view_users AS
                SELECT u.*, r.name as role_name
                FROM users u
                LEFT JOIN roles r ON r.id = u.role_id;
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
            DROP VIEW IF EXISTS view_users;
            SQL;
    }
}
