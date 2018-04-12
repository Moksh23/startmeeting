# Zimbra StartMeeting integration (development not for production)

StartMeeting easy-to-use online meetings with HD audio, video conferencing and screen sharing. If you are interested in using Start Meeting in your company contact Brandon Klein (bklein@freeconferencecall.com).

This Zimlet allows you to add Start Meeting information to your Zimbra appointments to share the online meeting link with participants.

The Zimlet also allows you to join/host a Start Meeting if you receive an email or calendar invite with a Start Meeting Link.

![alt tag](https://raw.githubusercontent.com/Zimbra-Community/startmeeting/master/help/screenshot.png)

## Configure and install the Zimlet

You must download a copy of the Zimlet using git, configure your companies Start Meeting URL (contact sales) and then deploy.

    git clone https://github.com/Zimbra-Community/startmeeting
    nano startmeeting/tk_barrydegraaff_startmeeting/config_template.xml 
    # set startMeetingURL 
    <property name="startMeetingURL">https://yourcompany.startmeeting.com</property>
    cd startmeeting/tk_barrydegraaff_startmeeting/
    zip tk_barrydegraaff_startmeeting.zip *
    su zimbra
    zmzimletctl deploy tk_barrydegraaff_startmeeting.zip

