import { Bill, Service } from "./Bill"
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer"

import { User } from "../user-auth/User"
import { addTax } from "./addTax"
import { calcBillSum } from "./calcBillSum"
import { formatAmount } from "src/lib/utils/formatAmount"

const accentColor = "#5412ce"

export default function BillPdf({ user, bill }: { user: User; bill: Bill }) {
  return (
    <Document>
      <Page style={styles.body}>
        <BillHeader user={user} />

        <View
          style={[
            styles.divider,
            { backgroundColor: user?.accentColor || accentColor },
          ]}
        ></View>

        <View
          style={{ display: "flex", flexDirection: "row", marginBottom: 16 }}
        >
          <BillInfos bill={bill} />
          <BillCustomer bill={bill} />
        </View>

        <View style={{ border: "1px solid #f4f4f4" }}>
          <View style={[styles.th, styles.flex, styles.flexRow]}>
            <Text style={[styles.cell, styles.cellDetails]}>Details</Text>
            <Text style={[styles.cell, styles.cellQte]}>Qté</Text>
            <Text style={[styles.cell, styles.cellPrixUnitaire]}>
              Prix Unitaire
            </Text>
            {/* <Text style={[styles.cell, styles.cellTVA]}>TVA %</Text> */}
            <Text style={[styles.cell, styles.prixHT]}>Total HT</Text>
          </View>

          <View style={styles.hr} />

          {bill.services.map((service: Service) => (
            <View key={service.id} style={[styles.flex, styles.flexRow]}>
              <Text style={[styles.cell, styles.cellDetails]}>
                {service.detail}
              </Text>
              <Text style={[styles.cell, styles.cellQte]}>
                {service.quantity}
              </Text>
              <Text style={[styles.cell, styles.cellPrixUnitaire]}>
                {formatAmount(service.price).replaceAll(/\s/g, " ")}
              </Text>
              <Text style={[styles.cell, styles.prixHT]}>
                {formatAmount(service.quantity * service.price).replaceAll(
                  /\s/g,
                  " ",
                )}
              </Text>
            </View>
          ))}

          <View style={styles.hr} />

          <View
            style={[
              styles.flex,
              styles.flexRow,
              {
                alignItems: "center",
                borderTop: "1px dotted #f4f4f4",
              },
            ]}
          >
            <PaymentDetails user={user} />
            <BillSums bill={bill} />
          </View>
        </View>

        <Text
          style={{
            lineHeight: 1.35,
            marginTop: 12,
            paddingHorizontal: 12,
          }}
        >
          Cette facture vous a été envoyé cette facture le {bill.sentAt}.
          Celle-ci doit être réglée sous 30 jour(s) à compter de cette date.
          Passé ce délai, une pénalité de retard de 10 % sera appliquée, ainsi
          qu'une indemnité forfaitaire de 40€ due au titre des frais de
          recouvrement. Pas d'escompte pour règlement anticipé.
        </Text>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  )
}

function BillHeader({ user }: { user: User }) {
  return (
    <>
      {user.society.logo ? (
        <View style={styles.header}>
          <View>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={user.society.logo as string} style={styles.logo} />
          </View>
        </View>
      ) : null}
      <View style={styles.header}>
        <Text style={styles.headerName}>{user.society.name}</Text>
        <Text style={{ color: "#cccccc" }}> | </Text>
        <Text
          style={[
            { color: user?.accentColor || accentColor },
            styles.fontTitle,
          ]}
        >
          {user.society.baseline}
        </Text>
      </View>
      <View style={styles.headerInfos}>
        <Text>
          {user.society.phone} - {user.society.email}
        </Text>
        <Text>{user.society.adress}</Text>
        <Text>Siret: {user.society.siren}</Text>
      </View>
    </>
  )
}

function BillInfos({ bill }: { bill: Bill }) {
  return (
    <View style={{ flexGrow: 1, padding: 4 }}>
      <Text style={[styles.fontTitleBold, styles.textBlack]}>
        Facture N° {bill.number}
      </Text>
      <Text style={{ paddingTop: 2 }}>Date d'émission : 13/07/2022</Text>
    </View>
  )
}

function BillCustomer({ bill }: { bill: Bill }) {
  return (
    <View
      style={{
        textAlign: "right",
        backgroundColor: "#f4f4f4",
        flexGrow: 1,
        padding: 4,
      }}
    >
      <Text style={[styles.fontTitleBold, styles.textBlack]}>
        {bill.customer.name}
      </Text>
      <Text style={{ paddingTop: 2 }}>{bill.customer.adress}</Text>
      <Text style={{ paddingTop: 2 }}>SIREN : {bill.customer.siren}</Text>
    </View>
  )
}

function PaymentDetails({ user }: { user: User }) {
  const paymentDetailsOpacity = user.showPaymentInformation ? 1 : 0
  return (
    <View style={[styles.cell, { flexGrow: 1 }]}>
      <View style={{ opacity: paymentDetailsOpacity }}>
        <Text
          style={[styles.fontTitle, styles.fontTitleBold, styles.textBlack]}
        >
          Informations de paiement
        </Text>
        <View style={[styles.flex, styles.flexRow]}>
          <Text style={{ width: "2cm" }}>BIC</Text>
          <Text>{user.bic}</Text>
        </View>
        <View style={[styles.flex, styles.flexRow]}>
          <Text style={{ width: "2cm" }}>IBAN</Text>
          <Text>{user.iban}</Text>
        </View>
      </View>
    </View>
  )
}

function BillSums({ bill }: { bill: Bill }) {
  const amountHT = calcBillSum(bill)
  const amountTTC = addTax(amountHT, bill.taxRate)

  return (
    <View style={[styles.cell, { flexGrow: 1, backgroundColor: "#f4f4f4" }]}>
      <View
        style={[
          styles.flex,
          styles.flexRow,
          {
            paddingHorizontal: "4px",
            paddingVertical: "2px",
          },
        ]}
      >
        <Text style={[styles.fontTitle, styles.textBlack, { flexGrow: 1 }]}>
          Total HT
        </Text>
        <Text style={{ textAlign: "right" }}>
          {formatAmount(amountHT).replaceAll(/\s/g, " ")}
        </Text>
      </View>
      <View
        style={[
          styles.flex,
          styles.flexRow,
          { paddingHorizontal: "4px", paddingVertical: "2px" },
        ]}
      >
        <Text style={[styles.fontTitle, styles.textBlack, { flexGrow: 1 }]}>
          TVA ({bill.taxRate}%)
        </Text>
        <Text
          style={{
            textAlign: "right",
          }}
        >
          {formatAmount(amountTTC - amountHT).replaceAll(/\s/g, " ")}
        </Text>
      </View>
      <View
        style={[
          styles.flex,
          styles.flexRow,
          {
            backgroundColor: "#f4f4f4",
            paddingHorizontal: "4px",
            paddingVertical: "2px",
          },
        ]}
      >
        <Text style={[styles.fontTitleBold, styles.textBlack, { flexGrow: 1 }]}>
          Total
        </Text>
        <Text
          style={[styles.fontBold, styles.textBlack, { textAlign: "right" }]}
        >
          {formatAmount(amountTTC).replaceAll(/\s/g, " ")}
        </Text>
      </View>
      {bill.taxRate === 0 && (
        <Text style={{ padding: "4px" }}>
          TVA non applicable, article 293B du CGI
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  body: {
    paddingTop: 16,
    paddingBottom: 65,
    paddingHorizontal: 64,
    fontSize: 10,
    color: "#565656",
    fontFamily: "Times-Roman",
    lineHeight: 1.25,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 12,
  },
  logo: { width: "auto", height: "24px", marginBottom: 4 },
  headerName: {
    color: "#000",
    fontFamily: "Helvetica-Bold",
  },
  headerInfos: {
    marginTop: 6,
    textAlign: "center",
    fontFamily: "Times-Roman",
    lineHeight: 1.5,
  },
  divider: {
    width: 16,
    height: 1,
    marginVertical: "16",
    marginHorizontal: "auto",
  },
  hr: {
    backgroundColor: "#f4f4f4",
    height: "1px",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  flex: {
    display: "flex",
  },
  flexRow: {
    flexDirection: "row",
  },
  itemsCenter: {
    alignItems: "center",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  textAccent: {
    color: accentColor,
  },
  fontTitle: {
    fontFamily: "Helvetica",
  },
  fontTitleBold: {
    fontFamily: "Helvetica-Bold",
  },
  fontBold: {
    fontFamily: "Times-Bold",
  },
  textBlack: {
    color: "black",
  },
  textCenter: {
    textAlign: "center",
  },
  cell: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexShrink: 0,
    flexGrow: 0,
  },
  th: {
    fontFamily: "Helvetica-Bold",
    color: "black",
  },
  cellDetails: {
    width: "8cm",
  },
  cellQte: {
    width: "2cm",
    textAlign: "center",
  },
  cellPrixUnitaire: {
    width: "4cm",
    textAlign: "right",
  },
  cellTVA: {
    width: "3cm",
    textAlign: "center",
  },
  prixHT: {
    width: "4cm",
    textAlign: "right",
  },
})
