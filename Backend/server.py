from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json
from markupsafe import escape
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier

server = Flask(__name__)
cors = CORS(server)
server.config['CORS_HEADERS'] = 'Content-Type'

data = pd.read_csv(r"./Converted_Data_model.csv")
y_train = data["Disease"]
X_train = data.iloc[:, 1:]
X_train = X_train.values.tolist()
y_train = data["Disease"].tolist()
knn_clf = KNeighborsClassifier(metric='jaccard')
knn_clf.fit(X_train, y_train)


def predict_disease(symptoms):
    # print(symptoms_dict)

    # x_test = [data.iloc[1, 1:]]
    # print(x_test)

    symptoms_dict = data.iloc[0:0, 1:]
    symptoms_dict = symptoms_dict.to_dict()

    for keys in symptoms_dict:
        symptoms_dict[keys] = 0.0

    for symptom in symptoms:
        if symptom in symptoms_dict:
            symptoms_dict[symptom] = 1.0

    X_test = [list(symptoms_dict.values())]
    # print(type(X_train), type(y_train))

    # print(type(y_train), y_train)
    distance, prediction = knn_clf.kneighbors(X_test, n_neighbors=10)

    prediction = prediction.tolist()
    # print(prediction)
    que = []

    # print(prediction)
    for i in prediction:
        for j in i:
            # print(type(j), j)
            que.append(y_train[j])

    # prediction = knn_clf.predict(X_test)
    # print(type(que), que)
    return que


def give_symptoms(disease):
    index = data[data['Disease'] == disease].index
    df = data.iloc[index][data.iloc[index] == 1.0]
    dit = df.to_dict()
    symp = []
    for keys in dit:
        for key in dit[keys]:
            if dit[keys][key] == 1.0:
                symp.append(keys)
    return symp


@server.route('/', methods=['GET', 'POST'])
@cross_origin()
def index():
    if request.method == 'POST':
        symptoms = request.json
        # symptoms = request.form["symptoms"]
        symptoms = symptoms["list"]

        print(symptoms)

        prediction = predict_disease(symptoms)
        jsonDictList = []
        for predi in prediction:
            symptomsOut = give_symptoms(predi)

            jsonDict = {"disease": predi, "sym": symptomsOut}
            jsonDictList.append(jsonDict)

        # print(jsonDictList)

        return jsonify(jsonDictList)

    return '''
        <form method="post">
            Symptoms: <input type="text" name="symptoms"><br>
            <input type="submit" value="Submit"><br>
        </form>
    '''


if __name__ == '__main__':
    server.run(debug=True, host="0.0.0.0", port=80)
