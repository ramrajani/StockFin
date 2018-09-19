
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.*;
import org.omg.PortableInterceptor.SYSTEM_EXCEPTION;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

public class JobDoer {
    static PrintWriter pw,pwf;
    static HashMap<String,ArrayList<String>> hm= new HashMap<>();

    public static void main(String args[]) throws Exception {

        String folderName="stocks";

        String jsonFilname="stockjson";
        JSONObject finalObject=new JSONObject();

        JSONArray companyArray=new JSONArray();
        for(int i=8;i<=8;++i) {

            readThenWriteJSON("//home//kjsce//Desktop//files//"+jsonFilname+""+i+".json", folderName+i+"",companyArray);
            pw = new PrintWriter("//home//kjsce//Desktop//files//output//" + jsonFilname +i+".json");
            finalObject.put("companyArray",companyArray);
            pwf.flush();
            pw.write(finalObject.toJSONString());

            pw.flush();
            break;

        }



        pwf.close(); pw.close();


    }

    static void readThenWriteJSON(String name,String foldername,JSONArray companyArray) throws Exception {
        File f=new File("//home//kjsce//Desktop//files//output//"+foldername +"\\failures.txt");
        Object obj = new JSONParser().parse(new FileReader(name));

        pwf=new PrintWriter(f);
        JSONObject jo = (JSONObject) obj;
        JSONArray companyList = (JSONArray) jo.get("pusharray");

        Iterator it = companyList.iterator();


        while (it.hasNext()) {
            JSONObject companyObject = (JSONObject) it.next();
            JSONObject editedCompany = new JSONObject();
            editedCompany.put("name", companyObject.get("sharename"));
            editedCompany.put("bse", companyObject.get("bse"));
            editedCompany.put("nse", companyObject.get("nse"));


            String code = (String) companyObject.get("bse");

            try {
                addExcelData(editedCompany);
            }
            catch (FileNotFoundException fnfe){
                pwf.println(code);
            }
            catch (Exception e){
                pwf.println(code);
                System.out.println("Something went terribly wrong with code "+code);


            }
            companyArray.add(editedCompany);

        }


    }

    static void addExcelData(JSONObject editedCompany) throws Exception {
        String bseCode = (String) editedCompany.get("bse");
        File f = new File("//home//kjsce//Desktop//files//stocks8//" + bseCode + ".xlsx");
        FileInputStream fis = new FileInputStream(f);
        XSSFWorkbook wb = new XSSFWorkbook(fis);
        XSSFSheet s1 = wb.getSheetAt(5);

        addData(editedCompany, s1, "ProfitLoss", 16, 31);
        addData(editedCompany, s1, "Quarters", 41, 50);
        addData(editedCompany, s1, "BalanceSheet", 56, 72);
        addData(editedCompany, s1, "CashFlow", 81, 85);


    }

    static void addData(JSONObject editedCompany, XSSFSheet s1, String parameter, int start, int end) {


        JSONObject year = new JSONObject();
        int ind = 1;

        if(!hm.containsKey(parameter)) {
            ArrayList<String> al = new ArrayList<>();
            for (int i = start; i < end; ++i) {

                String test= s1.getRow(i).getCell(0).toString();
                test=test.replaceAll("\\s+","");
                al.add(test);

            }
            hm.put(parameter,al);
        }
        JSONArray ja=new JSONArray();
        while (true) {
            String date = "";
            try {
                date = s1.getRow(start - 1).getCell(ind).toString();


            } catch (Exception e) {
                break;
            }
            JSONObject keyValue = new JSONObject();

            ArrayList<String> al=hm.get(parameter);
            for (int i = start, cnt = 0; i < end; ++i, ++cnt) {
                String element;
                try {
                    element = s1.getRow(i).getCell(ind).toString();

                } catch (Exception e) {
                    element = "null";
                }

                keyValue.put(al.get(cnt), element);

            }
            keyValue.put("year",date);
            ja.add(keyValue);

            ind++;

        }
        editedCompany.put(parameter, ja);

    }

}
