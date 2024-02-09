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
                CREATE VIEW view_products AS select 
                    p.id, 
                    p.code, 
                    p.name,
                    p.brand_id,
                    p.category_id,
                    p.type,
                    p.barcode_symbology,
                    p.unit_id,
                    p.purchase_unit_id,
                    p.sale_unit_id,
                    p.cost,
                    p.price,
                    p.qty,
                    p.alert_quantity,
                    p.promotion,
                    p.promotion_price,
                    p.starting_date,
                    p.last_date,
                    p.tax_id,
                    p.tax_method,
                    CONCAT('public/',p.image) as picture,
                    p.product_details,
                    p.is_active,
                    p.created_at,
                    p.updated_at,
                    p.deleted_at,
                    p.user_id,
                    b.name as brand_name,
                    c.name as category_name,
                    ut.unit_name,
                    CONCAT(u.name , ' ', u.last_name) as  asuser_name
                FROM products p
                INNER JOIN units ut ON p.unit_id = ut.id 
                INNER JOIN categories c ON p.category_id = c.id 
                INNER JOIN brands b ON p.brand_id = b.id 
                INNER JOIN users u ON p.user_id  = u.id 
                WHERE p.deleted_at IS NULL;
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
