import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

export const SignOutButton = () => {
    // Use `useClerk()` to access the `signOut()` function
    const { signOut } = useClerk()
    const handleSignOut = async () => {
        try {
            await signOut()
            // Redirect to your desired page
            Linking.openURL(Linking.createURL('/'))
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }
    return (
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
            <Text style={styles.text}>Sign out</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        backgroundColor: '#ff3b30',
        borderRadius: 8,
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
