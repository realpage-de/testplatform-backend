<?php
namespace Pages\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;
use Cake\Database\Schema\TableSchemaInterface;

class PagesTable extends Table
{

    public function initialize(array $config): void
    {
        $this->setTable('pages');
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
        $validator
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
            ->requirePresence('path', 'create')
            ->add('path', 'maxLength', [
                'rule' => ['maxLength', 250],
                'message' => 'Maximal 250 Zeichen'
			])
			->add('path', 'unique', [
				'rule' => ['validateUnique'],
				'provider' => 'table',
				'message' => 'Pfad existiert bereits'
            ])
            ->add('path', '_valid', [
                'rule' => ['custom', '/(^$)|(^[-_a-zA-Z0-9\/]+$)/'],
                'message' => 'Darf nur aus Buchstaben, Zahlen, - _ / bestehen'
            ]);

        $validator
            ->requirePresence('content', 'create')
            ->notEmptyString('content', 'Feld muss ausgefüllt sein');

        return $validator;
    }
}