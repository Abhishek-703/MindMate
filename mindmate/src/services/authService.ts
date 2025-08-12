

import { supabase } from './supabaseClient';
import { Provider, Session, User } from '@supabase/supabase-js';

export async function register(name: string, email: string, password: string): Promise<{ user: User | null; session: Session | null; }> {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
                avatar_url: null,
            }
        }
    });
    if (error) throw new Error(error.message);
    return data;
}

export async function verifyOtp(email: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'
    });
    if (error) throw new Error(error.message);
    return data;
}

export async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    if (error) throw new Error(error.message);
    return data.user;
}

export async function socialLogin(provider: Provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
    });
    if (error) throw new Error(error.message);
    return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
}

export async function updateUser(updatedData: { full_name?: string, password?: string }) {
    const { data, error } = await supabase.auth.updateUser({
        data: updatedData.full_name ? { full_name: updatedData.full_name } : undefined,
        password: updatedData.password
    });
    if (error) throw new Error(error.message);
    return data.user;
}


export async function uploadAvatar(userId: string, file: File) {
    if (!file) {
        throw new Error("You must select an image to upload.");
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

    if (uploadError) {
        throw uploadError;
    }

    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
    
    const publicUrl = data.publicUrl;
    
    const { data: updatedUser, error: updateUserError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
    });

    if (updateUserError) {
        throw updateUserError;
    }
    
    return updatedUser.user;
}


export async function sendPasswordResetEmail(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // No redirectTo is needed for OTP flow
    });
    if (error) throw new Error(error.message);
}

export async function resetPassword(email: string, token: string, newPassword: string) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery'
    });
    if (verifyError) throw new Error(verifyError.message);

    const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword
    });

    if (updateError) throw new Error(updateError.message);
    return data.user;
}