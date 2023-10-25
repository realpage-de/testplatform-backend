<?php
namespace Users\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class UserInterestsTable extends Table
{

    public function initialize(array $config): void
    {
        $this->setTable('users_interests');
    }

    public function validationDefault(Validator $validator): Validator
    {
		$validator
            ->notEmptyString('user_id', 'Feld muss ausgefüllt sein')
            ->add('user_id', '_valid', [
                'rule' => function($value) {
                    try {
                        TableRegistry::getTableLocator()->get('Users.Users')->get((int)$value);
                        $status = true;
                    } catch (RecordNotFoundException $exception) {
                        $status = false;
                    }
                    return $status;
                },
                'message' => 'Benutzer existiert nicht'
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

        return $validator;
    }
}