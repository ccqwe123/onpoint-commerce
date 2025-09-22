<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price', 'discount_price', 'type', 'is_active'];

    public function descriptions()
    {
        return $this->hasMany(PlanDescription::class);
    }
}
