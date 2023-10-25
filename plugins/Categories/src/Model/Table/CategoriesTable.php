<?php
namespace Categories\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class CategoriesTable extends Table
{

    public function initialize(array $config): void
    {
        $this->setTable('categories');
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
                'rule' => ['maxLength', 50],
                'message' => 'Maximal 50 Zeichen'
            ])
			->add('name', 'unique', [
				'rule' => ['validateUnique'],
				'provider' => 'table',
				'message' => 'Kategorie existiert bereits'
            ]);

        return $validator;
    }
}