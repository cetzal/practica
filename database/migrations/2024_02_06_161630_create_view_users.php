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
                SELECT 
                    u.id, 
                    u.name, 
                    u.last_name, 
                    u.email, 
                    u.picture, 
                    u.is_active, 
                    r.name as role_name, 
                    u.user_parent_id, 
                    CONCAT(u2.name, ' ', u2.last_name) as user_parent_name,
                    u.created_at,
                    u.updated_at,
                    u.deleted_at
                FROM 
                    users u
                LEFT JOIN users u2 on u.user_parent_id = u2.id
                INNER JOIN roles r ON r.id = u.role_id
                where u.deleted_at IS NULL;
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
