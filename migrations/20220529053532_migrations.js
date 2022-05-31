/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
     
    return knex.schema
        .createTable('users_data',table=>{
            table.increments('id').primary();
            table.string('email').unique();
            table.string('name');
            table.string('password')
        })
        
        .createTable('user_post',table=>{
            table.increments('id').primary();
            table.string("email");
            table.string('write_status');
            
        })
        .createTable('like_dislike',table=>{
            table.increments('id').primary();
            table.string("post_id");
            table.string('email');
            table.boolean('like');
            table.boolean("dislike")
        })
         
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTable('users_data')
    .dropTable('user_post')
    .dropTable('like_dislike')
};
