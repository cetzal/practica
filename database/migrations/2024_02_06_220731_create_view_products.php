<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateViewProducts extends Migration
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
     * Create view products
     * 
     * @return string
     */
    public function createView()
    {
        return <<<SQL
                CREATE VIEW view_products AS
                    select p.*, b.name as branch_name, u.name asuser_name
                    FROM products p
                    LEFT JOIN brands b ON b.id = p.brand_id
                    LEFT JOIN users u On u.id = p.user_id;
                SQL;
    }

    /**
     * Drop view products if exists
     * 
     * @return string
     */
    public function dropView()
    {
        return <<<SQL
                DROP VIEW IF EXISTS view_products;
            SQL;
    }
}
