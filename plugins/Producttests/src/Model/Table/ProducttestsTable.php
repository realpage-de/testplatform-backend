<?php
namespace Producttests\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;
use Cake\ORM\TableRegistry;
use Cake\Datasource\Exception\RecordNotFoundException;
use Cake\Database\Schema\TableSchemaInterface;
use App\Model\Validation\StatusValidator;

class ProducttestsTable extends Table
{

    public function initialize(array $config): void
    {
        $this->setTable('producttests');

        $this->belongsTo('Category', [
            'className' => 'Categories.Categories',
            'foreignKey' => 'category_id'
		]);

		$this->belongsTo('Customer', [
            'className' => 'Customers.Customers',
            'foreignKey' => 'customer_id'
		]);
    }

	protected function _initializeSchema(TableSchemaInterface $schema): TableSchemaInterface
    {
		// set field type "editor" to "content"
        $schema->setColumnType('content', 'editor');

        // set field type "editor" to "phase_1_content"
        $schema->setColumnType('phase_1_content', 'editor');

        // set field type "editor" to "phase_2_content"
        $schema->setColumnType('phase_2_content', 'editor');

        // set field type "editor" to "phase_3_content"
        $schema->setColumnType('phase_3_content', 'editor');

		return $schema;
	}

    public function validationDefault(Validator $validator): Validator
    {
        $is_active = null;

		$callbackNotEmpty = function($context) use (&$is_active) {
			if ($is_active !== null) {
				return $is_active;
			}
			if (isset($context['data']['status']) && (int)$context['data']['status'] === 1) {
				$is_active = true;
			}
			else if ($context['newRecord']) {
				$primaryKey = $this->getPrimaryKey();
				if (isset($context['data'][$primaryKey])) {
					try {
						$entity = TableRegistry::getTableLocator()->get($this->getRegistryAlias())->get((int)$context['data'][$primaryKey]);
						$is_active = $entity->get('status');
					} catch (RecordNotFoundException $exception) {
						$is_active = false;
					}
				}
			}
			return $is_active;
		};

		$validator
			->requirePresence('status', 'create')
		    ->notEmptyString('status', locale('Status muss angegeben werden'))
			->boolean('status', locale('Status muss 1 oder 0 sein'));

        $validator
            ->requirePresence('name', 'create')
            ->notEmptyString('name', 'Feld muss ausgefüllt sein')
            ->add('name', 'maxLength', [
                'rule' => ['maxLength', 250],
                'message' => 'Maximal 250 Zeichen'
            ]);

        $validator
            ->notEmptyString('category_id', 'Feld muss ausgefüllt sein', $callbackNotEmpty)
            ->add('category_id', '_valid', [
                'rule' => function($value) {
                    try {
                        TableRegistry::getTableLocator()->get('Categories.Categories')->get((int)$value);
                        $status = true;
                    } catch (RecordNotFoundException $exception) {
                        $status = false;
                    }
                    return $status;
                },
                'message' => 'Kategorie existiert nicht'
            ]);

		$validator
            ->notEmptyString('customer_id', 'Feld muss ausgefüllt sein', $callbackNotEmpty)
            ->add('customer_id', '_valid', [
                'rule' => function($value) {
                    try {
                        TableRegistry::getTableLocator()->get('Customers.Customers')->get((int)$value);
                        $status = true;
                    } catch (RecordNotFoundException $exception) {
                        $status = false;
                    }
                    return $status;
                },
                'message' => 'Kunde existiert nicht'
			]);

        $validator
            ->notEmptyString('image', 'Feld muss ausgefüllt sein', $callbackNotEmpty)
            ->add('image', 'maxLength', [
                'rule' => ['maxLength', 250],
                'message' => 'Maximal 250 Zeichen'
            ]);

        $validator
            ->notEmptyString('content', 'Feld muss ausgefüllt sein', $callbackNotEmpty);

        $validator
            ->add('seal_image', 'maxLength', [
                'rule' => ['maxLength', 250],
                'message' => 'Maximal 250 Zeichen'
            ]);

		$validator
			->notEmptyString('phase_1_date_start', 'Feld muss ausgefüllt sein', $callbackNotEmpty);

		$validator
			->notEmptyString('phase_1_date_end', 'Feld muss ausgefüllt sein', $callbackNotEmpty);

		$validator
            ->notEmptyString('phase_1_content', 'Feld muss ausgefüllt sein', $callbackNotEmpty);

		$validator
			->notEmptyString('phase_2_date_start', 'Feld muss ausgefüllt sein', $callbackNotEmpty);

		$validator
			->notEmptyString('phase_2_date_end', 'Feld muss ausgefüllt sein', $callbackNotEmpty);

		$validator
			->notEmptyString('phase_2_content', 'Feld muss ausgefüllt sein', $callbackNotEmpty);

		$validator
			->notEmptyString('phase_3_date_start', 'Feld muss ausgefüllt sein', $callbackNotEmpty);

		$validator
			->notEmptyString('phase_3_date_end', 'Feld muss ausgefüllt sein', $callbackNotEmpty);

		$validator
			->notEmptyString('phase_3_content', 'Feld muss ausgefüllt sein', $callbackNotEmpty);

        return $validator;
    }
}