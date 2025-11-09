<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Plan;
use App\Models\PlanDescription;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $plans = [
            [
                'name' => 'Basic Monthly',
                'price' => 499.00,
                'discount_price' => 399.00,
                'type' => 'monthly',
                'descriptions' => [
                    'Access to basic features',
                    'Email support',
                    'Up to 5 users',
                    'Community resources',
                    '1 GB storage',
                ],
            ],
            [
                'name' => 'Premium Monthly',
                'price' => 999.00,
                'discount_price' => 799.00,
                'type' => 'monthly',
                'descriptions' => [
                    'All basic features included',
                    'Priority email support',
                    'Up to 20 users',
                    'Advanced analytics',
                    '10 GB storage',
                ],
            ],
            [
                'name' => 'Enterprise Custom',
                'price' => null,
                'discount_price' => null,
                'type' => 'custom',
                'descriptions' => [
                    'Custom number of users',
                    'Dedicated account manager',
                    '24/7 phone support',
                    'Unlimited storage',
                    'Tailored solutions for your business',
                ],
            ],
        ];

        foreach ($plans as $planData) {
            // Create plan
            $plan = Plan::create([
                'name' => $planData['name'],
                'price' => $planData['price'],
                'discount_price' => $planData['discount_price'],
                'type' => $planData['type'],
                'is_active' => true,
            ]);

            // Create descriptions
            foreach ($planData['descriptions'] as $desc) {
                PlanDescription::create([
                    'plan_id' => $plan->id,
                    'name' => $desc,
                ]);
            }
        }
    }
}
