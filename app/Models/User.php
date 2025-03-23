<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles; 

use Spatie\Permission\Traits\HasPermissions;
use Spatie\Permission\Models\Permission;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, HasPermissions; 

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'phone',
        'role_id',
        'email',
        'password',
        'staff_number',
        'status',
        'kyc',
        'unique_number'
    ];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'model_has_permissions', 'model_id', 'permission_id')
                    ->where('model_type', self::class);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function product(){
        return $this->hasOne('App\Models\Product', 'id', 'product_id');
    }

    public function role(){
        return $this->hasOne('Spatie\Permission\Models\Role','id','role_id');
    }

    public function getSimplePermissionsAttribute($value){
        $userPermissions=$this->permissions;
        $userPermissionsD=array();
        foreach($userPermissions as $permission){
            $userPermissionsD[]=$permission->name;
        }
        return $userPermissionsD;
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            do {
                $letter = strtoupper(chr(rand(65, 90))); 
                $randomNumber = rand(10000, 99999);
                $uniqueNumber = $letter . $randomNumber;
            } while (self::where('unique_number', $uniqueNumber)->exists()); 

            $product->unique_number = $uniqueNumber;
        });
    }
}