#Load and show an image with Pillow
import cv2
import math
import sys

def encode(byte, msg):
    bnr = bin(byte).replace('0b', '')
    x = bnr[::-1]  # this reverses an array
    while len(x) < 8:
        x += '0'
    bnr = x[::-1]
    return(int(bnr[:6] + msg, 2))

def decode(byte):
    bnr = bin(byte).replace('0b', '')
    x = bnr[::-1]  # this reverses an array
    while len(x) < 8:
        x += '0'
    bnr = x[::-1]
    return(bnr[6:])

def secretMessage(file, message):
    message = messageTobytes(message)
    img = cv2.imread(file)
    count = 0
    for i, row in enumerate(img):
        for j, pixel in enumerate(row):
            for k, color in enumerate(pixel):
                img[i, j, k] = encode(color, message[count])
                count += 1
                if count == len(message):
                    return img

def readMessage(file):
    message = []
    img = cv2.imread(file)
    for row in img:
        for pixel in row:
            for color in pixel:
                message.append(decode(color))
    string = []
    for i in range(math.ceil(len(message) / 4)):
        if message[i*4][0] == '1':
            break
        string.append(message[i * 4] + message[i * 4 + 1] + message[i * 4 + 2] + message[i * 4 + 3])
    characters = [int(i, 2) for i in string]
    return("".join([chr(i) for i in characters]))

def messageTobytes(message):
    msg = []
    b = bytes(message, encoding='utf-8')
    for byte in b:
        bnr = bin(byte).replace('0b', '')
        x = bnr[::-1]  # this reverses an array
        while len(x) < 8:
            x += '0'
        bnr = x[::-1]
        msg.append(bnr[0:2])
        msg.append(bnr[2:4])
        msg.append(bnr[4:6])
        msg.append(bnr[6:8])
    msg.append('10')
    return(msg)


def main(flag, file, messageFile=''):
    if flag == '-e':
        with open(messageFile) as fs:
            message = fs.readline()
        img = secretMessage(file, message)
        cv2.imwrite("output.png", img)
    elif (flag == '-d'):
        print(readMessage(file))
    else:
        print('Modes: encode: -e | decode: -d')



if __name__ == "__main__":
    if len(sys.argv) == 4:
        main(sys.argv[1], sys.argv[2], sys.argv[3])
    elif len(sys.argv) == 3:
        main(sys.argv[1], sys.argv[2])
    else:
        print('Usage: stenography.py -modeFlag file messageFile')
