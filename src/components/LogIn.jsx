import {useEffect, useState} from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

export default function LogIn(props) {
    const {supabase} = props
    
    return (
        <div className='login--container'>
            <Auth
                supabaseClient={supabase}
                providers={false}
                appearance={{
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: '#4A7B9D',
                          brandAccent: '#d2d3d2',
                        },
                      },
                    },
                  }}
            />
        </div>
    )
}