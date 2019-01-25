class CreateSteps < ActiveRecord::Migration[5.2]
  def change
    create_table :steps do |t|
      t.string :imageURL
      t.string :howTo
      t.references :recipe, foreign_key: true

      t.timestamps
    end
  end
end
