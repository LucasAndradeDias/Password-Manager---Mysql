import mysql.connector,secrets,json
from flask import Flask, render_template,request,Request,make_response,Response,jsonify, redirect,url_for, session

app = Flask(__name__)
app.secret_key = ""
pin = ""
### Classes

class CheckPin():
    def InsertFirstPin(pinInserted):
        if pinInserted == pin:
            session['pin'] = 'activated'
            return True
        else:
            return False
    def CheckPinSession():
        if "pin" in session:
            if session['pin'] == "activated":
                return True
        else:
            return False

class genPass():
    def __init__(self,rangee,password):
        self.range = rangee
        self.iPass = f"{password}"
    def genPass(self):
        li = []
        for i in range(0,(self.range)):
            p = secrets.choice(self.iPass)
            li.append(p)
        final = ''.join(li)
        return final

class SQl():
    def __init__(self):
        f = open('infos.json','r')
        k = json.loads(f.read())
        host = k['mysql']['host']
        UserName = k['mysql']['UserName']
        Password = k['mysql']['Password']
        self.Db = mysql.connector.connect(host=host,user=UserName,password=Password,database='passwords')
        self.Cursor = self.Db.cursor(buffered=True)
    def NewPass(self,Site,Password):
        self.Cursor.execute("INSERT INTO Passwords(SiteApp,Password) VALUES(%s,%s)",(Site,Password)) 
        self.Db.commit()
    def ChargePass(self,Site,Password):
        self.Cursor.execute(f"UPDATE Passwords SET Password='{Password}' WHERE SiteApp='{Site}'")
        self.Db.commit()
    def DeletePass(self,Site):
        self.Cursor.execute(f"DELETE FROM Passwords WHERE SiteApp='{Site}'")
        print('asda')
        self.Db.commit()
    def getPass(self,Site):
        self.Cursor.execute(f"SELECT Password FROM Passwords WHERE SiteApp='{Site}'")
        res = self.Cursor.fetchone()
        if res == None:
            return False
        else:
            return res[0]

## ROUTES

# Route Home
@app.route("/", methods=["POST","GET"])
def home():
    if request: 
        if CheckPin.CheckPinSession() == True:
            return render_template('home.html')
        else:
            return render_template("inspin.html")

## API Routes

# Check Pin
@app.route("/pin", methods=["POST"])
def pin():
    if request.method == "POST" and request.is_json:
        data = request.get_json()
        p = CheckPin.InsertFirstPin(data['pin'])
        if p == True:
            return make_response("True")
        else:
            return make_response("False")
    else:   
        return make_response("False")

# Generate New Password

@app.route("/NewPass", methods=['POST'])
def NewPass():
    if request.method == "POST" and CheckPin.CheckPinSession() == True :
        if request.is_json:
            try:
                data = request.get_json()
                if (SQl().getPass(data['siteapp'])) == False:
                    if data['senhabsopt']  == False:
                        numbers = '0123456789'
                        words = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@!#$0123456789'
                        password = ''
                        if data['numbersonly'] == False:
                            password  = (genPass(int(data['range']),words).genPass())
                            SQl().NewPass(data['siteapp'],password)
                        else:
                            password = genPass(int(data['range']),numbers).genPass()
                            SQl().NewPass(data['siteapp'],password)
                        return make_response(jsonify({'code':1,'siteapp':data['siteapp'],'password':password})) 
                    if data['senhabsopt']  == True:
                        if data['numbersonly'] == True:
                            numbers = []
                            password = ''
                            for i in data['senhabs']:
                                for j in '0123456789':
                                    if i == j:
                                        numbers.append(i)
                            password = genPass(int(data['range']),(''.join(numbers))).genPass()
                            return make_response(jsonify({'code':True,'siteapp':data['siteapp'],'password':password})) 
                        if data['numbersonly'] == False:
                            password = genPass(int(data['range']),data['senhabs']).genPass()
                            return make_response(jsonify({'code':1,'siteapp':data['siteapp'],'password':password})) 
                else:
                    return make_response(jsonify({'code':0,'error':2,'siteapp':data['siteapp']})) 
            except: 
                return make_response(jsonify({'code':0,'error':1}))


# Add Password

@app.route("/AddNewPass", methods=["POST"])
def AddNewPass():
    if request.method == 'POST' and CheckPin.CheckPinSession() == True:
        try:
            if request.is_json:
                data = request.get_json()
                if (SQl().getPass(data['siteapp'])) == False:
                    try:SQl().NewPass(data['siteapp'],data['password'])
                    except: return make_response(jsonify({'code':0,'error':1}))
                    else: return make_response(jsonify({'code':1,'siteapp':data['siteapp']}))
                else:
                    return make_response(jsonify({'code':0,'error':2,'siteapp':data['siteapp']})) 
        except:
            return make_response(jsonify({'code':0,'error':1,'siteapp':data['siteapp']}))  



# Get Password

@app.route("/GetPass", methods=["POST"])
def GetPass():
    if request.method == "POST" and CheckPin.CheckPinSession() == True:
        try:
            if request.is_json:
                siteappps = SQl().getPass(request.get_json()['siteapp'])
                if siteappps != False:
                    return make_response(jsonify({'code':1,'siteapp':request.get_json()['siteapp'],'password':siteappps,'error':0}))
                else:
                    return make_response(jsonify({'code':0,'siteapp':request.get_json()['siteapp'],'error':2}))
        except:
            return make_response(jsonify({'code':0,'error':1}))

@app.route("/ChangePassword", methods=["POST"])
def ChangePassword():
    if request.method == 'POST' and CheckPin.CheckPinSession() == True:
        data = request.get_json()
        if SQl().getPass(data['siteapp']) != False:
            try: SQl().ChargePass(data['siteapp'],data['password'])
            except: return make_response(jsonify({"code":0,"error":1}))
            else: return make_response(jsonify({"code":1,"siteapp":data['siteapp'],"password":data['password']}))
        else:
            return make_response(jsonify({"code":0,"error":2,"siteapp":data['password']}))
    else:
        return make_response(jsonify({"code":0,"error":1}))

@app.route("/DeletePassword", methods=["POST"])
def DeletePassword():
    if request.method == 'POST' and CheckPin.CheckPinSession() == True:
        data = request.get_json()
        if SQl().getPass(data['siteapp']) != False:
            try: SQl().DeletePass(data['siteapp'])
            except: return make_response(jsonify({"code":0,"error":1}))
            else: return make_response(jsonify({"code":1,"siteapp":data['siteapp']}))
        else:
            return make_response(jsonify({"code":0,"error":2,"siteapp":data['siteapp']}))
    else:
        return make_response(jsonify({"code":0,"error":1}))





if __name__ == "__main__":
    with open('infos.json','r') as infos:
        f = infos.read()
        j = json.loads(f)
        app.secret_key = j['safety']['secretkey']
        pin = j['safety']['pin']
    app.run(debug=True)
