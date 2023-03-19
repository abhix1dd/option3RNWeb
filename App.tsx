/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {useState, useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  PermissionsAndroid,
  Platform,  
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  FlatList,  
  TextInput,  
  Text,
  useColorScheme,
  View,
  Alert,
} from 'react-native';

import Contacts from 'react-native-contacts';
import ListItem from './components/ListItem';
import * as ContactsWeb from 'expo-contacts';



const App = () => {

  let [contacts, setContacts] = useState([]);
  let [webContacts, setWebContacts] = useState(-2);
  let [avai, setAvail] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
        }).then(() => {
          loadContacts();
        }
      );
    } else {
      loadContacts();
    }
  }, []);


const loadContacts = async () => {
    if(Platform.os ==='android'){
      Contacts.getAll()
      .then(contacts => {
        contacts.sort(
          (a, b) => 
          a.givenName.toLowerCase() > b.givenName.toLowerCase(),
        );
        console.log("contacts read")
        setContacts(contacts);
      })
      .catch(e => {
        alert('Permission to access contacts was denied');
        console.warn('Permission to access contacts was denied');
      });
    }else{
      console.log('Fetching Permissions');
        const { status } = await ContactsWeb.requestPermissionsAsync();
        let availabel = await ContactsWeb.isAvailableAsync()
        console.log('Permissions',status);
        console.log('Permissions',availabel);
        setAvail(availabel);
        // if (status === 'granted') {
          const { data } = await ContactsWeb.getContactsAsync({
            fields: [
              ContactsWeb.Fields.PhoneNumbers
            ],
            sort: ContactsWeb.SortTypes.FirstName 
        });
        setWebContacts(data.length)
          console.log(data.length)
          if (data.length > 0) {
            const contact = data[0];
            console.log(contact);
          }
        // }
      }
  };


const openContact = (contact) => {

    console.log(JSON.stringify(contact));
    Contacts.openExistingContact(contact);
  };

  return (
    <SafeAreaView style={styles.container}>
    <h1>{webContacts}</h1>
    <h1>{avai.toString()}</h1>
      <View style={styles.container}>
        <FlatList
          data={contacts}
          renderItem={(contact) => {
            {
              console.log('contact -> ' + JSON.stringify(contact));
            }
            return (
              <ListItem
                key={contact.item.recordID}
                item={contact.item}
                onPress={openContact}
              />
            );
          }}
          keyExtractor={(item) => item.recordID}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4591ed',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 20,
  },
  searchBar: {
    backgroundColor: '#f0eded',
    paddingHorizontal: 30,
    paddingVertical: Platform.OS === 'android' ? undefined : 15,
  },
});

export default App;


/*
type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text>
        {title}
      </Text>
      <Text>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';



  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        >
        
        <View
          >
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>


          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

*/