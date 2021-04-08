import sys,os


class Packages():
    def Packages(self):
        import pip
        Packages = ['mysql-connector-python','flask']
        try: 
            for i in Packages:
                pip.main(['install',i])
        except:
            return False
        else:
            return True

class GetDatas():
    def genScr():
        import secrets
        num = [1,2,3,4,5,6,7,8,9]
        nums = ['1','2','3','4','5','6','7','8','9','0']
        let = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
        let2 = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
        r = 0
        o = secrets.choice(num)
        i = secrets.choice(num)
        r +=o
        r +=i
        selected = []
        for i in range(2,r):
            l1 = secrets.choice(let)
            l2 = secrets.choice(let2)
            n = secrets.choice(nums)
            selected.append(l1)
            selected.append(l2)
            selected.append(n)
        key = ''.join(selected)
        return key
    def Datas(pin,host,UserName,Password):
        import json
        f = open('infos.json','w')
        k = GetDatas.genScr()
        f.write(json.dumps({"safety":{"pin": pin,"secretkey":k},"mysql":{"host":host,'UserName':UserName,"Password":Password}}))
        f.close()

class Mysql():
    def Create():
        import mysql.connector,json
        f = open('infos.json','r')
        k = json.loads(f.read())
        host = k['mysql']['host']
        UserName = k['mysql']['UserName']
        Password = k['mysql']['Password']

        try:
            Db = mysql.connector.connect(host= host ,user= UserName ,password= Password)
            Cursor = Db.cursor(buffered=True)
            Cursor.execute("CREATE DATABASE passwords")
            Db.commit()
        except:
            return False
        else:
            try:
                Db = mysql.connector.connect(host= host ,user= UserName ,password= Password ,database="passwords")
                Cursor = Db.cursor(buffered=True)
                Cursor.execute("CREATE TABLE Passwords(id INT PRIMARY KEY, SiteApp VARCHAR(200), Password VARCHAR(501))")
                Db.commit()
            except:
                return False
            else:
                return True

def main():
    sys.stdout.write("Installing Password Manager")
    p = Packages().Packages()
    if p == True:
        try:
            pin = input(str("Create PIN code: "))
            mysqlhost = input(str("Mysql server host name: "))
            mysqluser = input(str("Mysql server UserName: "))
            mysqlpassword = input(str("Mysql server password: "))
            GetDatas.Datas(pin,mysqlhost,mysqluser,mysqlpassword)
        except:
            sys.stdout.write("There were a error ")
        else:
            try:
                Mysql.Create()
            except:
                sys.stdout.write("There were a error ")
            else:
                sys.stdout.write("Password Manager Install success")
    else:
        sys.stdout.write("There were a error ")


if __name__ == "__main__":
    main()
