import { Injectable } from '@angular/core';

@Injectable()
export class IconService {

    public ACCIDENT_TYPES = {
        Head_On: `assets/icons/tap/accident_types/head_on.svg`,
        Overturned: `assets/icons/tap/accident_types/overturned.svg`,
        Rear_End: `assets/icons/tap/accident_types/rear_end.svg`,
        Sideswipe_Opposite: `assets/icons/tap/accident_types/sideswipe_opposite.svg`,
        Sideswipe_Same: `assets/icons/tap/accident_types/sideswipe_same.svg`,
        Single_Vehicle: `assets/icons/tap/accident_types/single_vehicle.svg`,
        T_Bone: `assets/icons/tap/accident_types/t_bone.svg`,
        With_Animal: `assets/icons/tap/accident_types/with_animal.svg`,
        With_Object: `assets/icons/tap/accident_types/with_object.svg`,
        With_Pedestrian: `assets/icons/tap/accident_types/with_pedestrian.svg`,
        With_Train: `assets/icons/tap/accident_types/with_train.svg`,
    };

    public COLOUR_OF_CLOTHING = {
        Dark: `assets/icons/tap/colour_of_clothing/dark.svg`,
        Light: `assets/icons/tap/colour_of_clothing/light.svg`,
        Light_And_Dark: `assets/icons/tap/colour_of_clothing/light_and_dark.svg`,
        Reflective: `assets/icons/tap/colour_of_clothing/reflective.svg`,
    };

    public COMMON = {
        Good: `assets/icons/tap/common/good.svg`,
        Not_Applicable: `assets/icons/tap/common/not_applicable.svg`,
        Not_Good: `assets/icons/tap/common/not_good.svg`,
        Other: `assets/icons/tap/common/other.svg`,
        Unknown: `assets/icons/tap/common/unknown.svg`,
    };

    public CONDITION_OF_ROAD_SIGNS = {
        Damaged_Or_Missing: `assets/icons/tap/condition_of_road_signs/damaged_or_missing.svg`,
    };

    public DIRECTION_OF_ROAD = {
        Curving: `assets/icons/tap/direction_of_road/curving.svg`,
    };

    public DRIVER_USE_OF_CELL = {
        Cellphone_No: `assets/icons/tap/driver_use_of_cell/cellphone_no.svg`,
        Cellphone_Yes: `assets/icons/tap/driver_use_of_cell/cellphone_yes.svg`,
    };

    public FLAT_OR_SLOPED = {
        Downhill: `assets/icons/tap/flat_or_sloped/downhill.svg`,
        Flat: `assets/icons/tap/flat_or_sloped/flat.svg`,
        Steep_Downhill: `assets/icons/tap/flat_or_sloped/steep-downhill.svg`,
        Steep_Uphill: `assets/icons/tap/flat_or_sloped/steep-uphill.svg`,
        Uphill: `assets/icons/tap/flat_or_sloped/uphill.svg`,
    };

    public GENERAL = {
        No_But_It_Was_Fitted_Present: `assets/icons/tap/general/no_but_it_was_fitted_present.svg`,
        No_But_It_Was_Suspected: `assets/icons/tap/general/no_but_it_was_suspected.svg`,
    };

    public JUNCTION_TYPES = {
        Circle: `assets/icons/tap/junction_types/circle.svg`,
        Cross_Road: `assets/icons/tap/junction_types/cross_road.svg`,
        Level_Crossing: `assets/icons/tap/junction_types/level_crossing.svg`,
        Not_A_Junction_Or_Crossing: `assets/icons/tap/junction_types/not_a_junction_or_crossing.svg`,
        Off_Ramp_Slipway: `assets/icons/tap/junction_types/off_ramp_slipway.svg`,
        On_Ramp_Slipway: `assets/icons/tap/junction_types/on_ramp_slipway.svg`,
        Pedestrian_Crossing: `assets/icons/tap/junction_types/pedestrian_crossing.svg`,
        Property_Driveway_Access: `assets/icons/tap/junction_types/property_driveway_access.svg`,
        Staggered_Junction: `assets/icons/tap/junction_types/staggered_junction.svg`,
        T_Junction: `assets/icons/tap/junction_types/t_junction.svg`,
        Y_Junction: `assets/icons/tap/junction_types/y_junction.svg`,
    };

    public LIGHT_CONDITIONS = {
        Dawn_Dusk: `assets/icons/tap/light_conditions/dawn_dusk.svg`,
        Day_Light: `assets/icons/tap/light_conditions/day_light.svg`,
        Night_Lit_By_Street_Light: `assets/icons/tap/light_conditions/night_lit_by_street_light.svg`,
        Night_Unlit: `assets/icons/tap/light_conditions/night_unlit.svg`,
    };

    public OBSTRUCTIONS = {
        Accident_Site: `assets/icons/tap/obstructions/accident_site.svg`,
        None: `assets/icons/tap/obstructions/none.svg`,
        Road_Block: `assets/icons/tap/obstructions/road_block.svg`,
        Road_Works: `assets/icons/tap/obstructions/road_works.svg`,
    };

    public OVER_TAKING_CONTROLS = {
        Barrier_Line: `assets/icons/tap/over_taking_controls/barrier_line.svg`,
        Road_Sign: `assets/icons/tap/over_taking_controls/road_sign.svg`,
    };

    public PEDESTRIAN_ACTION = {
        Lying: `assets/icons/tap/pedestrian_action/lying.svg`,
        Playing: `assets/icons/tap/pedestrian_action/playing.svg`,
        Running: `assets/icons/tap/pedestrian_action/running.svg`,
        Sitting: `assets/icons/tap/pedestrian_action/sitting.svg`,
        Standing: `assets/icons/tap/pedestrian_action/standing.svg`,
        Walking: `assets/icons/tap/pedestrian_action/walking.svg`,
        Working: `assets/icons/tap/pedestrian_action/working.svg`,
    };

    public PEDESTRIAN_LOCATION = {
        Not_At_Crossing: `assets/icons/tap/pedestrian_location/not_at_crossing.svg`,
        Withing_50m_Of_Crossing: `assets/icons/tap/pedestrian_location/withing_50m_of_crossing.svg`,
        Within_Marked_Crossing: `assets/icons/tap/pedestrian_location/within_marked_crossing.svg`,
    };

    public PEDESTRIAN_MANOUEVERS = {
        Back_To_Traffic: `assets/icons/tap/pedestrian_manouevers/back_to_traffic.svg`,
        Crossing_Road: `assets/icons/tap/pedestrian_manouevers/crossing_road.svg`,
        Facing_Traffic: `assets/icons/tap/pedestrian_manouevers/facing_traffic.svg`,
    };

    public PEDESTRIAN_POSITION = {
        Median: `assets/icons/tap/pedestrian_position/median.svg`,
        Roadway: `assets/icons/tap/pedestrian_position/roadway.svg`,
        Shoulder_Of_Road: `assets/icons/tap/pedestrian_position/shoulder_of_road.svg`,
        Sidewalk: `assets/icons/tap/pedestrian_position/sidewalk.svg`,
    };

    public POSITION_BEFORE_ACCIDENT = {
        Correct_Road_Lane: `assets/icons/tap/position_before_accident/correct-road-lane.svg`,
        Off_Road_Parking_Bay: `assets/icons/tap/position_before_accident/off-road-parking-bay.svg`,
        On_Road_Parking_Bay: `assets/icons/tap/position_before_accident/on-road-parking-bay.svg`,
        Road_Shoulder: `assets/icons/tap/position_before_accident/road-shoulder.svg`,
        Wrong_Road_Lane: `assets/icons/tap/position_before_accident/wrong-road-lane-but-right-side-of-road.svg`,
        Wrong_Side_Of_Road: `assets/icons/tap/position_before_accident/wrong-side-of-road.svg`,
    };

    public QUALITY_OF_ROAD = {
        Bumpy: `assets/icons/tap/quality_of_road/bumpy.svg`,
        Corrugated: `assets/icons/tap/quality_of_road/corrugated.svg`,
        Cracks: `assets/icons/tap/quality_of_road/cracks.svg`,
        Potholes: `assets/icons/tap/quality_of_road/potholes.svg`,
    };

    public ROAD_DIRECTIONS = {
        Curving: `assets/icons/tap/road_directions/curving.svg`,
        Sharp_Curve: `assets/icons/tap/road_directions/sharp_curve.svg`,
        Straight: `assets/icons/tap/road_directions/straight.svg`,
    };

    public ROAD_SURFACE_CONDITIONS = {
        Dry: `assets/icons/tap/road_surface_conditions/dry.svg`,
        Ice: `assets/icons/tap/road_surface_conditions/ice.svg`,
        Loose_Gravel_Or_Sand: `assets/icons/tap/road_surface_conditions/loose_gravel_or_sand.svg`,
        Slippery: `assets/icons/tap/road_surface_conditions/slippery.svg`,
        Snow: `assets/icons/tap/road_surface_conditions/snow.svg`,
        Water_Standing: `assets/icons/tap/road_surface_conditions/water_standing.svg`,
        Wet: `assets/icons/tap/road_surface_conditions/wet.svg`,
        Wet_In_Areas: `assets/icons/tap/road_surface_conditions/wet_in_areas.svg`,
    };

    public ROAD_SURFACE_TYPES = {
        Concrete: `assets/icons/tap/road_surface_types/concrete.svg`,
        Dirt: `assets/icons/tap/road_surface_types/dirt.svg`,
        Gravel: `assets/icons/tap/road_surface_types/gravel.svg`,
        Tarmac: `assets/icons/tap/road_surface_types/tarmac.svg`,
    };

    public ROAD_TYPES = {
        Dual_Carriageway: `assets/icons/tap/road_types/dual_carriageway.svg`,
        Freeway: `assets/icons/tap/road_types/freeway.svg`,
        Off_Road_Parking_Rank: `assets/icons/tap/road_types/off_road_parking_rank.svg`,
        One_Way: `assets/icons/tap/road_types/one_way.svg`,
        On_Off_Ramp: `assets/icons/tap/road_types/on_off_ramp.svg`,
        On_Road_Parking_Rank: `assets/icons/tap/road_types/on_road_parking_rank.svg`,
        Single_Carriageway: `assets/icons/tap/road_types/single_carriageway.svg`,
    };

    public SEVERITY_OF_INJURY = {
        Killed: `assets/icons/tap/severity_of_injury/killed.svg`,
        No_Injury: `assets/icons/tap/severity_of_injury/no_injury.svg`,
        Serious: `assets/icons/tap/severity_of_injury/serious.svg`,
        Slight: `assets/icons/tap/severity_of_injury/slight.svg`,
    };

    public TRAFFIC_CONTROL_TYPES = {
        All_Robots_Out_Of_Order: `assets/icons/tap/traffic_control_types/all_robots_out_of_order.svg`,
        Barrier_Line: `assets/icons/tap/traffic_control_types/barrier_line.svg`,
        Boom: `assets/icons/tap/traffic_control_types/boom.svg`,
        Flashing_Robots: `assets/icons/tap/traffic_control_types/flashing_robots.svg`,
        Not_A_Junction_Crossing_Or_Barrier_Line: `assets/icons/tap/traffic_control_types/not_a_junction_crossing_or_barrier_line.svg`,
        Officer: `assets/icons/tap/traffic_control_types/officer.svg`,
        Officer_Robot: `assets/icons/tap/traffic_control_types/officer_robot.svg`,
        Pedestrian_Crossing: `assets/icons/tap/traffic_control_types/pedestrian_crossing.svg`,
        Robot: `assets/icons/tap/traffic_control_types/robot.svg`,
        Some_Robots_Out_Of_Order: `assets/icons/tap/traffic_control_types/some_robots_out_of_order.svg`,
        Stop_Sign: `assets/icons/tap/traffic_control_types/stop_sign.svg`,
        Uncontrolled_Junction: `assets/icons/tap/traffic_control_types/uncontrolled_junction.svg`,
        Yield_Sign: `assets/icons/tap/traffic_control_types/yield_sign.svg`,
    };

    public TRAPPED_OR_FALLEN_OUT = {
        Fallen_Out: `assets/icons/tap/trapped_or_fallen_out/fallen_out.svg`,
        Trapped: `assets/icons/tap/trapped_or_fallen_out/trapped.svg`,
    };

    public VEHICLE_TRAVEL_DIRECTION = {
        East: `assets/icons/tap/vehicle_travel_direction/east.svg`,
        North: `assets/icons/tap/vehicle_travel_direction/north.svg`,
        South: `assets/icons/tap/vehicle_travel_direction/south.svg`,
        West: `assets/icons/tap/vehicle_travel_direction/west.svg`,
    };

    public VEHICLE_TYPES = {
        Above_125cc: `assets/icons/tap/vehicle_types/above_125cc.svg`,
        Animal_Drawn: `assets/icons/tap/vehicle_types/animal_drawn.svg`,
        Bicycle: `assets/icons/tap/vehicle_types/bicycle.svg`,
        Bus: `assets/icons/tap/vehicle_types/bus.svg`,
        Bus_Train: `assets/icons/tap/vehicle_types/bus_train.svg`,
        Caravan_Trailer: `assets/icons/tap/vehicle_types/caravan_trailer.svg`,
        Cc125_And_Under: `assets/icons/tap/vehicle_types/cc125_and_under.svg`,
        Gvm: `assets/icons/tap/vehicle_types/gvm.svg`,
        Light_Delivery: `assets/icons/tap/vehicle_types/light_delivery.svg`,
        Midibus: `assets/icons/tap/vehicle_types/midibus.svg`,
        Minibus: `assets/icons/tap/vehicle_types/minibus.svg`,
        Mobile_Equipment: `assets/icons/tap/vehicle_types/mobile_equipment.svg`,
        Motor_Car: `assets/icons/tap/vehicle_types/motor_car.svg`,
        Panel_Van: `assets/icons/tap/vehicle_types/panel_van.svg`,
        Quadru_Cycle: `assets/icons/tap/vehicle_types/quadru_cycle.svg`,
        Tractor: `assets/icons/tap/vehicle_types/tractor.svg`,
        Tri_Cycle: `assets/icons/tap/vehicle_types/tri_cycle.svg`,
        Truck: `assets/icons/tap/vehicle_types/truck.svg`,
        Truck_Multiple: `assets/icons/tap/vehicle_types/truck_multiple.svg`,
    };

    public WEATHER_CONDITIONS = {
        Clear: `assets/icons/tap/weather_conditions/clear.svg`,
        Dust: `assets/icons/tap/weather_conditions/dust.svg`,
        Fire_Smoke: `assets/icons/tap/weather_conditions/fire_smoke.svg`,
        Hail_Snow: `assets/icons/tap/weather_conditions/hail_snow.svg`,
        Mist_Fog: `assets/icons/tap/weather_conditions/mist_fog.svg`,
        Other: `assets/icons/tap/weather_conditions/other.svg`,
        Overcast: `assets/icons/tap/weather_conditions/overcast.svg`,
        Rain: `assets/icons/tap/weather_conditions/rain.svg`,
        Severe_Wind: `assets/icons/tap/weather_conditions/severe_wind.svg`,
    };

    public WHAT_DRIVER_WAS_DOING = {
        Avoiding_Object: `assets/icons/tap/what_driver_was_doing/avoiding_object.svg`,
        Busy_Parking: `assets/icons/tap/what_driver_was_doing/busy-parking.svg`,
        Changing_Lanes: `assets/icons/tap/what_driver_was_doing/changing_lanes.svg`,
        Diverging: `assets/icons/tap/what_driver_was_doing/diverging.svg`,
        Enter_Traffic_Flow: `assets/icons/tap/what_driver_was_doing/enter_traffic_flow.svg`,
        Merging: `assets/icons/tap/what_driver_was_doing/merging.svg`,
        Overtaking_Pass_Left: `assets/icons/tap/what_driver_was_doing/overtaking_pass_left.svg`,
        Overtaking_Pass_Right: `assets/icons/tap/what_driver_was_doing/overtaking_pass_right.svg`,
        Parked: `assets/icons/tap/what_driver_was_doing/parked.svg`,
        Reversing: `assets/icons/tap/what_driver_was_doing/reversing.svg`,
        Slowing_Down: `assets/icons/tap/what_driver_was_doing/slowing_down.svg`,
        Stationery: `assets/icons/tap/what_driver_was_doing/stationery.svg`,
        Sudden_Start: `assets/icons/tap/what_driver_was_doing/sudden_start.svg`,
        Sudden_Stop: `assets/icons/tap/what_driver_was_doing/sudden_stop.svg`,
        Swerving: `assets/icons/tap/what_driver_was_doing/swerving.svg`,
        Traveling_Straight: `assets/icons/tap/what_driver_was_doing/traveling_straight.svg`,
        Turning_Left: `assets/icons/tap/what_driver_was_doing/turning_left.svg`,
        Turning_Right: `assets/icons/tap/what_driver_was_doing/turning_right.svg`,
        U_Turn: `assets/icons/tap/what_driver_was_doing/u_turn.svg`,
    };

}
