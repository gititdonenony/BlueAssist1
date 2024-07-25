
export interface claimModel
{

    claim_id:number,
    user_id:string,
    userdata_id:number,
    claim_address:string,
    claim_lat:string,
    claim_lng:string,
    claim_updated_at:string,
    claim_status:string,
    claim_created_at:string
}

export class AccidentSceneModel
{
    claim_id:number;
    right_image:string;
    front_image:string;
    back_image:string;
    left_image:string;
    type:string;
    description:string;
}

export class YourVehicleDamageModel
{
    claim_id:number;
    vehicle_type:string;
    vehicle_position_before_accident:string;
    you_doing:string;
    vehicle_direction:string;
    cond_vehicle_light:string;
    cond_veh_reflector:string;
    road_road_flatorsloped:string;
    vehicle_damages_front_image:string;
    front_right_image:string;
    front_left_image:string;
    back_image:string;
    back_right_image:string;
    back_left_image:string;
    left_front_image:string;
    left_back_image:string;
    right_front_image:string;
    right_back_image:string;
    bonnet_image:string;
    roof_image:string;
    boot_image:string;
    multiple_damage_image:string;
    caughtonfire_image:string;
    rolled_image:string;
    under_carrige_image:string;
    no_details_image:string;
    no_damage_image:string;
    windoworwindscreen_image:string;
}
export class OtherVehicleDamageModel
{
    claim_id:number;
    vehicle_type:string;
    vehicle_position_before_accident:string;
    they_doing:string;
    vehicle_direction:string;
    cond_vehicle_light:string;
    cond_veh_reflector:string;
    road_road_flatorsloped:string;
    vehicle_damages_front_image:string;
    front_right_image:string;
    front_left_image:string;
    back_image:string;
    back_right_image:string;
    back_left_image:string;
    left_front_image:string;
    left_back_image:string;
    right_front_image:string;
    right_back_image:string;
    bonnet_image:string;
    roof_image:string;
    boot_image:string;
    multiple_damage_image:string;
    caughtonfire_image:string;
    rolled_image:string;
    under_carrige_image:string;
    no_details_image:string;
    windoworwindscreen_image:string;
    no_damage_image:string;
}

export class RoadConditionModal
{
    claim_id:number;
    surface_type:string;
    surface_type_evidence_image:string;
    road_type_was:string;
    road_type_was_evidence_image:string;
    surface_was:string;
    surface_was_evidence_image:string;
    road_quality:string;
    road_quality_evidence_image:string;
    road_direction:string;
    road_direction_evidence_image:string;
    junction_type:string;
    junction_type_evidence_image:string;
    traffic_control:string;
    traffic_control_evidence_image:string;
    visibility_road_marking:string;
    visibility_road_marking_evidence_image:string;
    road_sign_visible:string;
    road_sign_visible_evidence_image:string;
    condition_road_sign:string;
    condition_road_sign_evidence_image:string;
    overtaking_control:string;
    overtaking_control_evidence_image:string;
    obstructions:string;
    obstructions_evidence_image:string;
    light_condition:string;
    light_condition_evidence_image:string;
    weather_condition:string;
    weather_condition_evidence_image:string;
}

export class OtherDriverInfo
{
    claim_id:number;
    fullname:string;
    surname:string;
    initial:string;
    cell_number:string;
    home_address:string;
    id_number:string;
    country_origin:string;
    describe_other_driver:string;
    license_type:string;
    license_number:string;
    license_date_issue:string;
    license_code:string;
    seatbelt_helmet:string;
    driver_injured:string;
    carry_passengers:string;
    tested_liquerdrug:string;
}

export class OtherDriveVehicleInfo
{
    claim_id:number
    number_plate:string;
    licence_disknumber:string;
    vehicle_color:string;
    vehicle_make:string;
    vehicle_model:string;
    tyres_burst:string;
    quality_chevron:string;
}

export class YourPersonalInfo
{
    claim_id:number
    fullname:string
    surname:string
    initial:string
    cell_number:string
    home_address:string;
    id_number:string;
    country_origin:string;
    describe_other_driver:string;
    license_type:string;
    license_number:string;
    license_date_issue:string;
    license_code:string;
    seatbelt_helmet:string;
    you_injured:string;
    carry_passengers:string;
    tested_liquerdrug:string;
    gender:string;
}

export class YourVehicleInfo
{
    claim_id:number;
    number_plate:string;
    licence_disknumber:string;
    vehicle_color:string;
    vehicle_make:string;
    vehicle_model:string;
    tyres_burst:string;
    quality_chevron:string;
}

export class CommonCasualty
{
    claim_id:number  
    pedestrians_injured:string;
    cyclist_injured:string;
    passenger_injured:string;
    surname:string;
    initial:string;
    cell_number:string;
    home_address:string;
    id_number:string;
    country_origin:string;
    describe_pedestrians:string;
    describe_cyclist:string;
    describe_passenger:string;
    age:string;
    seatbelt_helmet:string;
    tested_liquerdrug:string;
    gender:string;
}

export class WitnessInfo
{
    claim_id:number
    witness_info:string
    surname_initial:string
    home_address:string
    post_code:string
    cell_number:string
}
export class SpecialObservations
{
    claim_id:number;
    anyone_trappedfallen:string;
    usinghandheld_devicedriving:string;
}

export class DangerousGoods
{
    claim_id:number;
    good_carried:string;
    spillageoccur:string;
    vapour_gasemissionoccur:string;
    placard_displayonvehicle:string;
}
export class SubmitEmail
{
    claim_id:number
    accident_occurdate:string
    accident_occurtime:string
    email_sendto:string
}

export interface ClaimViewModel
{

    claim_id:number,
    user_id:string,
    userdata_id:number,
    claim_address:string,
    claim_lat:string,
    claim_lng:string,
    claim_updated_at:string,
    claim_status:number,
    claim_created_at:string;
    claim_ref:string;
}

export class ArLinkModel{
    ar_form_image: string;
}
