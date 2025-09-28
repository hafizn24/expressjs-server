const supabase = require('../supabase')

class RegisterController {
    static async setRegister(req, res) {
        const { user, location, invitation, contact } = req.body;

        try {
            const { data, error } = await supabase.rpc('register_invitation', {
                user_email: user.user_email,
                user_phone: user.user_phone,
                user_name: user.user_name,
                theme_id: user.theme_id,

                loc_name: location.loc_name,
                loc_address1: location.loc_address1,
                loc_address2: location.loc_address2,
                loc_postcode: location.loc_postcode,
                loc_city: location.loc_city,
                loc_state: location.loc_state,
                loc_google_maps_url: location.loc_google_maps_url || '',
                loc_waze_url: location.loc_waze_url || '',

                inv_title: invitation.inv_title,
                inv_bride_name: invitation.inv_bride_name,
                inv_groom_name: invitation.inv_groom_name,
                inv_date: invitation.inv_date,
                inv_start_time: invitation.inv_start_time,
                inv_end_time: invitation.inv_end_time,
                inv_background_top: invitation.inv_background_top || '',
                inv_background_bottom: invitation.inv_background_bottom || '',
                inv_custom_message: invitation.inv_custom_message,

                contact_name: contact.contact_name,
                contact_phone_number: contact.contact_phone_number,
                contact_role: contact.contact_role,
            });

            if (error) {
                console.error('RPC error:', error);
                return res.status(500).json({
                    error: 'Registration failed',
                    message: error.message,
                });
            }

            res.json({
                success: true,
                user_id: data.user_id,
                loc_id: data.loc_id,
                inv_id: data.inv_id,
            });
        } catch (err) {
            console.error('Unexpected error:', err);
            res.status(500).json({
                error: 'Unexpected failure',
                message: err.message,
            });
        }
    }

    static async getAllUserData(req, res) {
        const { user_name, user_email, user_phone } = req.query;

        try {
            let userQuery = supabase.from('users').select('*');

            if (user_name) {
                userQuery = userQuery.eq('user_name', user_name);
            } else if (user_email) {
                userQuery = userQuery.eq('user_email', user_email);
            } else if (user_phone) {
                userQuery = userQuery.eq('user_phone', user_phone);
            }

            const { data: users, error: userError } = await userQuery;
            if (userError) {
                return res.status(500).json({ success: false, message: 'User query failed', error: userError.message });
            }

            if (!users || users.length === 0) {
                return res.status(404).json({ success: false, message: 'No users found' });
            }

            // Fetch related data for each user
            const results = await Promise.all(users.map(async (user) => {
                const { data: invitation } = await supabase
                    .from('invitations')
                    .select('*')
                    .eq('user_id', user.user_id)
                    .single();

                const { data: location } = await supabase
                    .from('locations')
                    .select('*')
                    .eq('loc_id', invitation?.location_id)
                    .single();

                const { data: contacts } = await supabase
                    .from('contacts')
                    .select('*')
                    .eq('inv_id', invitation?.inv_id);

                return {
                    user,
                    invitation,
                    location,
                    contacts,
                };
            }));

            res.json({ success: true, count: results.length, data: results });
        } catch (error) {
            console.error('Fetch error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

module.exports = RegisterController