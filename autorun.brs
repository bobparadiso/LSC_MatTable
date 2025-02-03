'-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
sub processKeyboardCmd(html, cmd)
  print("got keyboard cmd:" + cmd)
  if left(cmd, 3) = "js " then
    html.PostJSMessage({data: mid(cmd,4)})
  else if cmd = "end" then
    end
  end if  
end sub

'-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
sub main()
  msgPort = createobject("roMessagePort")

  mode=CreateObject("roVideoMode")
  mode.SetMode("1920x1080x60p")
  'rect=CreateObject("roRectangle", mode.GetSafeX(), mode.GetSafeY(), mode.GetSafeWidth(), mode.GetSafeHeight())
  rect=CreateObject("roRectangle", 0, 0, mode.GetResX(), mode.GetResY())
  html=CreateObject("roHtmlWidget", rect)
  html.SetUrl("file:/index.html")
  html.EnableMouseEvents(true)
  html.SetLocalStorageDir("/local/")
  html.AllowJavaScriptUrls({ all: "local" })
  html.AddFont("OpenSans-ExtraBold.ttf")
  html.Show()
  html.setPort(msgPort)

  serial = CreateObject("roSerialPort", 0, 9600)
  serial.SetSendEol(chr(13) + chr(10))
  serial.SetReceiveEol(chr(13) + chr(10))
  serial.SetLineEventPort(msgPort)
  'serial.sendLine("")
  'serial.sendLine("testing 1, 2, 3...")

  keyboard = CreateObject("roKeyboard")
  keyboard.setPort(msgPort)

  keyboardCmd = ""

  while true
    msg = msgPort.GetMessage()
    msgType = type(msg)
    
    if msgType="roStreamLineEvent" then
      print("got serial:" + msg)
      if msg = "end" then end
      html.PostJSMessage({data: msg})
    else if msgType="roKeyboardPress" then
      'print("got keyboard ascii:" + msg.GetInt().tostr() + "   char:" + chr(msg))
      if msg <> 13 then
        keyboardCmd = keyboardCmd + chr(msg)
      else
        processKeyboardCmd(html, keyboardCmd)
        keyboardCmd = ""
      endif
    endif
    
    'print(msg)
  end while

end sub
