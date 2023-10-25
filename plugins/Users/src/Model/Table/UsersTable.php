<?php
namespace Users\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class UsersTable extends Table
{

    public function initialize(array $config): void
    {
        $this->setTable('users');

        $this->hasOne('Profile', [
            'className' => 'Users.Profiles',
            'foreignKey' => 'user_id',
            'dependent' => true,
            'cascadeCallbacks' => true
        ]);

        $this->hasMany('Children', [
            'className' => 'Users.Children',
            'foreignKey' => 'user_id',
            'dependent' => true,
            'cascadeCallbacks' => true
        ]);

        $this->belongsToMany('Interests', [
			'className' => 'Categories.Categories',
			'through' => 'Users.UserInterests',
			'foreignKey' => 'user_id',
			'targetForeignKey' => 'category_id',
            'dependent' => true,
            'cascadeCallbacks' => true
		]);
    }

    public function validationDefault(Validator $validator): Validator
    {
		$validator
			->requirePresence('status', 'create')
		    ->notEmptyString('status', locale('Status muss angegeben werden'))
			->boolean('status', locale('Status muss 1 oder 0 sein'));

        $validator
            ->requirePresence('username', 'create')
            ->notEmptyString('username', 'Feld muss ausgefüllt sein')
            ->add('username', 'maxLength', [
                'rule' => ['maxLength', 50],
                'message' => 'Maximal 50 Zeichen'
            ])
            ->add('username', 'unique', [
				'rule' => ['validateUnique'],
				'provider' => 'table',
				'message' => 'Benutzername existiert bereits'
            ]);

        $validator
            ->requirePresence('email', 'create')
            ->notEmptyString('email', 'Feld muss ausgefüllt sein')
            ->add('email', 'maxLength', [
                'rule' => ['maxLength', 254],
                'message' => 'Maximal 254 Zeichen'
            ])
            ->add('email', 'unique', [
				'rule' => ['validateUnique'],
				'provider' => 'table',
				'message' => 'E-Mailadresse existiert bereits'
            ]);

        $validator
            ->requirePresence('password', 'create')
            ->notEmptyString('password', 'Feld muss ausgefüllt sein', 'create')
            ->add('password', 'maxLength', [
                'rule' => ['maxLength', 100],
                'message' => 'Maximal 100 Zeichen'
            ]);

        $validator
			->requirePresence('newsletter', 'create')
		    ->notEmptyString('newsletter', locale('Newsletter muss angegeben werden'))
            ->boolean('newsletter', locale('Newsletter muss 1 oder 0 sein'));

        return $validator;
    }
}